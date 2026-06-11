<% uses gw.api.locale.DisplayKey %>

<%-- template for using Azure Maps for a heat map --%>

<% uses gw.api.heatmap.HeatMapGenerator
   uses gw.api.heatmap.IHeatMapTemplate
%>
<%@ params(heatMap : HeatMapGenerator, template : IHeatMapTemplate, mapOption : String) %>
  function initMap() {
    // set template-substituted variables
    mapName = "${ heatMap.MapName }";
    credential = "${ HeatMapGenerator.HeatMapCredential }";
    <% if (heatMap.SelectionMessageID != null) { %>
      selectionMessageNodeID = ":${ heatMap.SelectionMessageID }";
    <% } %>
    refreshUponSelection = ${ heatMap.RefreshUponSelection };

    zoom = ${ heatMap.Zoom };
    autoScale = ${ heatMap.AutoScale };
    // Azure Maps uses [longitude, latitude] format
    centerLatLong = [${ heatMap.CenterLng }, ${ heatMap.CenterLat }];
    _margin = ${ heatMap.Margin };
    _boundingBoxWidth = ${ heatMap.BoundingBoxWidth };
    _boundingBoxHeight = ${ heatMap.BoundingBoxHeight };
    markerSize = ${ heatMap.MarkerSize };

    MAX_ZOOM = ${ HeatMapGenerator.MAX_ZOOM };

    useKilometers = ${ heatMap.useKilometers };
    haveLegendImage = ${ heatMap.haveLegendImage() };

    popupMapWidth = ${ heatMap.popupMapWidth };
    popupMapHeight = ${ heatMap.popupMapHeight };
    popupMapElementName = ":${ heatMap.popupMapElementName }";

    cantLoadMapMessage = "${ DisplayKey.get("Web.HeatMap.CantLoadAzureMaps") }";

    // Azure Maps uses rgba format for colors
    selectionColor = 'rgba(${ heatMap.SelectionColor.Red }, ${ heatMap.SelectionColor.Green }, ${ heatMap.SelectionColor.Blue }, ${ heatMap.SelectionColor.Alpha/500. })';
    <% if (heatMap.SelectionPoint1 != null) { %>
      // Azure Maps uses [longitude, latitude] format
      selectionPoint1 = [${ heatMap.SelectionPoint1.getLong() }, ${ heatMap.SelectionPoint1.getLat() }];
      selectionPoint2 = [${ heatMap.SelectionPoint2.getLong() }, ${ heatMap.SelectionPoint2.getLat() }];
    <% } %>
    <% if (heatMap.AreaOfInterestColor != null) { %>
      // Azure Maps uses rgba format for colors with reduced opacity
      areaOfInterestColor = 'rgba(${ heatMap.AreaOfInterestColor.Red }, ${ heatMap.AreaOfInterestColor.Green }, ${ heatMap.AreaOfInterestColor.Blue }, ${ heatMap.AreaOfInterestColor.Alpha/1020. })';
    <% } %>

    <% if (heatMap.AreaOfInterestPoint1 != null) { %>
      // Azure Maps uses [longitude, latitude] format
      areaOfInterestPoint1 = [${ heatMap.AreaOfInterestPoint1.getLong() }, ${ heatMap.AreaOfInterestPoint1.getLat() }];
      areaOfInterestPoint2 = [${ heatMap.AreaOfInterestPoint2.getLong() }, ${ heatMap.AreaOfInterestPoint2.getLat() }];
    <% } %>
  }
